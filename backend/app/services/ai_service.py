import os
import re

from app.core.config import settings

try:
    import google.generativeai as genai
except ImportError:
    genai = None

api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

if genai is not None and api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-3.5-flash")
else:
    model = None


def summarize_note(content: str) -> str:
    return _generate_summary(content)


def generate_ai_reply(
    note_content: str,
    user_message: str,
    draft_content: str | None = None,
    draft_title: str | None = None,
) -> dict[str, str | None]:
    effective_content = draft_content or note_content
    effective_title = draft_title or ""
    prompt = (
        f"You are a helpful assistant for a note-taking app. "
        f"The note title is: {effective_title}\n"
        f"The note content is: {effective_content}\n"
        f"The user asks: {user_message}\n"
        "If the user wants to edit, rewrite, improve, or create the note, "
        "return an updated_content string for the note body and an updated_title string if needed. "
        "Otherwise return a short helpful reply."
    )

    if model is None:
        return _fallback_reply(prompt, effective_content, user_message, effective_title)

    try:
        response = model.generate_content(prompt)
        text = response.text
        return _parse_model_response(text, effective_content, user_message, effective_title)
    except Exception:
        return _fallback_reply(prompt, effective_content, user_message, effective_title)


def _fallback_reply(
    prompt: str,
    content: str,
    user_message: str,
    title: str,
) -> dict[str, str | None]:
    lower_message = user_message.lower()
    cleaned_content = (content or "").strip()

    if "summarize" in lower_message:
        summary = _fallback_summary(cleaned_content) if cleaned_content else "No content to summarize."
        return {
            "reply": summary,
            "updated_content": summary,
            "updated_title": title or "Summary",
        }

    if "bullet" in lower_message or "bullet points" in lower_message or "list" in lower_message:
        bullet_points = [f"- {line.strip()}" for line in cleaned_content.splitlines() if line.strip()][:6]
        if not bullet_points:
            bullet_points = [f"- {segment.strip()}" for segment in re.split(r"(?<=[.!?])\s+", cleaned_content) if segment.strip()][:6]
        updated_content = "\n".join(bullet_points) if bullet_points else cleaned_content
        return {
            "reply": updated_content,
            "updated_content": updated_content,
            "updated_title": title or "Bullet Points",
        }

    if any(word in lower_message for word in ["edit", "rewrite", "improve", "make", "change", "write", "new note", "new", "professional", "polish", "better"]):
        polished_content = _polish_note_content(cleaned_content)
        return {
            "reply": polished_content or cleaned_content or user_message,
            "updated_content": polished_content or cleaned_content or user_message,
            "updated_title": title or "Updated Note",
        }

    if cleaned_content:
        summary = _fallback_summary(cleaned_content)
        return {
            "reply": summary,
            "updated_content": cleaned_content,
            "updated_title": title or "Updated Note",
        }

    return {
        "reply": "I can help with this note. Try asking: summarize, improve, or turn this into bullet points.",
        "updated_content": None,
        "updated_title": None,
    }


def _polish_note_content(content: str) -> str:
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    if not lines:
        return content

    polished_lines = []
    for line in lines:
        if line.endswith((".", "!", "?")):
            polished_lines.append(line)
        else:
            polished_lines.append(f"{line}.")

    return "\n".join(polished_lines)


def _parse_model_response(
    text: str,
    content: str,
    user_message: str,
    title: str,
) -> dict[str, str | None]:
    lower_msg = user_message.lower()
    
    # Check if this is an editing / content-updating prompt
    is_update_prompt = "updated_content" in text.lower() or any(
        word in lower_msg for word in [
            "edit", "rewrite", "improve", "make", "change", "write", 
            "new note", "new", "bullet", "professional", "summarize", "summary"
        ]
    )

    if is_update_prompt:
        # Determine updated title dynamically
        updated_title = title
        if "summarize" in lower_msg or "summary" in lower_msg:
            updated_title = "Summary"
        elif "bullet" in lower_msg or "list" in lower_msg:
            updated_title = "Bullet Points"
        elif "professional" in lower_msg or "polish" in lower_msg:
            updated_title = "Polished Note"
        elif not updated_title:
            updated_title = "Updated Note"

        return {
            "reply": text.strip() or "I updated the note for you.",
            "updated_content": text.strip() or content,
            "updated_title": updated_title,
        }

    return {
        "reply": text.strip() or "I can help with this note.",
        "updated_content": None,
        "updated_title": None,
    }


def _generate_summary(content: str) -> str:
    if model is None:
        if not api_key:
            return "Summarization is unavailable because no Gemini API key was configured."
        return _fallback_summary(content)

    try:
        response = model.generate_content(f"Summarize this note in 2 sentences: {content}")
        return response.text
    except Exception:
        return _fallback_summary(content)


def _fallback_summary(content: str) -> str:
    sentences = re.split(r"(?<=[.!?])\s+", content.strip())
    cleaned = [s.strip() for s in sentences if s.strip()]
    if not cleaned:
        return "No content to summarize."
    if len(cleaned) == 1:
        return cleaned[0]
    return " ".join(cleaned[:2])