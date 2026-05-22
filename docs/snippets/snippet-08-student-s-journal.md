# Snippet 8: Student's Journal

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 8 |
| Name | Student's Journal |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-02-21 21:26:16 |
| Tags | — |
| Source file | `snippet-08-student-s-journal.md` |

## Code

```php
add_shortcode('student_review', 'custom_student_review_shortcode');

function custom_student_review_shortcode($atts, $content = null) {
    // Настройки по умолчанию
    $a = shortcode_atts(array(
        'name' => 'Ученик',
        'week' => '',
    ), $atts);

    // Блок с неделей (показываем, только если вы ее указали)
    $week_html = '';
    if (!empty($a['week'])) {
        $week_html = '<span class="review-week">' . esc_html($a['week']) . '</span>';
    }

    // Очищаем контент от лишних <br> и пробелов в начале и в конце, которые добавляет WordPress
    $clean_content = trim($content);
    $clean_content = preg_replace('/^(?:<br\s*\/?>\s*)+|(?:<br\s*\/?>\s*)+$/i', '', $clean_content);
    $clean_content = do_shortcode(wp_kses_post($clean_content));

    // Собираем HTML карточки
    $html = '
    <div class="custom-student-review">
        <div class="review-quote-icon">"</div>
        <div class="review-content">' . $clean_content . '</div>
        <div class="review-author">
            <span class="review-name">' . esc_html($a['name']) . '</span>
            ' . $week_html . '
        </div>
    </div>
    
    <style>
        .custom-student-review {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px 24px 20px 24px;
            margin: 30px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .review-quote-icon {
            position: absolute;
            top: -16px;
            left: 24px;
            background: #ffffff;
            color: #d1d5db;
            font-size: 48px;
            font-family: Georgia, serif;
            line-height: 1;
            padding: 0 8px;
            font-weight: bold;
        }
        .review-content {
            font-size: 16px;
            color: #374151;
            line-height: 1.6;
            font-style: italic;
            margin-bottom: 16px;
        }
        .review-author {
            display: flex;
            align-items: center;
            gap: 12px;
            border-top: 1px solid #f3f4f6;
            padding-top: 16px;
        }
        .review-name {
            font-weight: 700;
            color: #111827;
            font-size: 15px;
        }
        .review-week {
            background-color: #f1f5f9;
            color: #475569;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
    </style>
    ';

    return $html;
}
```
