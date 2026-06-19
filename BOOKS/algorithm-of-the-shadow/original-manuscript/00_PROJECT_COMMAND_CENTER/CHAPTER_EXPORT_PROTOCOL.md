# Chapter Export Protocol

Project: **The Algorithm of the Shadow**

## Permanent Rule

Every completed chapter must produce both a text file and a Word document.

This rule applies to:

- New chapter drafts.
- Revised chapter drafts.
- Replacement chapter drafts.
- Final canon-safe chapter versions.

## Required Completion Steps

After writing or revising any chapter, LUMAN must complete these steps before recommending the next move:

1. Save or update the chapter in the GitHub vault as a Markdown file inside `04_DRAFTS/`.
2. Display the full chapter text in the ChatGPT conversation for immediate review.
3. Create a downloadable `.txt` file of the completed chapter.
4. Create a downloadable `.docx` Word document of the completed chapter.
5. Provide direct download links for both files.
6. Then recommend the next best step.

## Required User-Facing Output

Every completed chapter response should include:

```text
GitHub chapter path
Download link for text file
Download link for Word document
Full chapter displayed in chat
Next best step
```

## Export Naming Convention

Use clean chapter file names:

```text
Chapter_XX_Chapter_Title.txt
Chapter_XX_Chapter_Title.docx
```

Example:

```text
Chapter_06_The_Ego_in_the_Echo_Chamber.txt
Chapter_06_The_Ego_in_the_Echo_Chamber.docx
```

## Command

```text
/export completed chapter
```

This command means: create the chapter text export and Word document export immediately from the completed chapter draft.

## Enforcement Note

Do not move on to the next chapter or next project step until the `.txt` and `.docx` chapter exports have been created and linked for Edward.
