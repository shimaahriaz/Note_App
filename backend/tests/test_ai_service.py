from app.services.ai_service import generate_ai_reply


def test_summarize_prompt_returns_content_based_reply_without_gemini():
    note_content = "We launched the new notes experience today.\nThe team improved onboarding and made the editor easier to use."

    result = generate_ai_reply(note_content, "summarize this note")

    assert result["updated_content"] is not None
    assert result["updated_content"] != ""
    assert result["updated_title"] == "Summary"
