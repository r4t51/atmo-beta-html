# Snippet 9: Course Info Card

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 9 |
| Name | Course Info Card |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-04-12 14:51:40 |
| Tags | — |
| Source file | `snippet-09-course-info-card.md` |

## Code

```php
add_shortcode('course_info_card', 'custom_course_info_card_shortcode');

function custom_course_info_card_shortcode( $atts ) {
    $a = shortcode_atts( array(
        'days' => '60',
    ), $atts );

    $days = esc_html( $a['days'] );

    return '
    <style>
        .custom-info-card { background: #ffffff !important; border: 1px solid #e5e7eb !important; border-radius: 12px !important; padding: 32px !important; margin: 30px 0 !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
        .info-list-item { display: flex !important; align-items: center !important; gap: 16px !important; margin-bottom: 20px !important; padding: 0 !important; }
        .info-list-item:last-child { margin-bottom: 0 !important; }
        .info-number { flex: 0 0 32px !important; width: 32px !important; height: 32px !important; background-color: #f1f5f9 !important; color: #334155 !important; font-weight: 700 !important; font-size: 15px !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; line-height: 1 !important; }
        .info-text { color: #374151 !important; font-size: 16px !important; line-height: 1.5 !important; margin: 0 !important; padding: 0 !important; }
        .info-text a { color: #20bec4 !important; font-weight: 600 !important; text-decoration: none !important; border-bottom: 1px solid rgba(32, 190, 196, 0.3) !important; transition: border-color 0.2s ease !important; }
        .info-text a:hover { border-color: #20bec4 !important; }
        .custom-info-card p, .custom-info-card br { display: none !important; }
    </style>
    <div class="custom-info-card">
                <div class="info-list-item"><span class="info-number">1</span><span class="info-text">Сразу после оплаты для вас будет автоматически создан личный кабинет. Найти свои тренировки всегда можно в разделе <a href="/my-account/orders/">Мой аккаунт</a>.</span></div>
        <div class="info-list-item"><span class="info-number">2</span><span class="info-text">Все материалы программы откроются моментально. Вы можете начать занятия в любую удобную для вас минуту.</span></div>
        <div class="info-list-item"><span class="info-number">3</span><span class="info-text">У вас будет доступ к урокам <strong>' . $days . ' дней</strong> или <strong>без ограничения по сроку</strong>, чтобы пройти программу в абсолютно комфортном для себя темпе.</span></div>
    </div>
    ';
}
```
