# Snippet 14: Courses Carousel for mainpage NEW

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 14 |
| Name | Courses Carousel for mainpage NEW |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-02-28 15:47:21 |
| Tags | — |
| Source file | `snippet-14-courses-carousel-for-mainpage-new.md` |

## Code

```php
add_shortcode('featured_courses', 'custom_featured_courses_shortcode');

function custom_featured_courses_shortcode($atts) {
    $a = shortcode_atts(array(
        'ids' => '',
    ), $atts);

    if (empty($a['ids'])) {
        return '<p>Пожалуйста, укажите ID курсов. Например: [featured_courses ids="10,15,22,45,50"]</p>';
    }

    $product_ids = array_map('trim', explode(',', $a['ids']));

    $args = array(
        'post_type'      => 'product',
        'post__in'       => $product_ids,
        'orderby'        => 'post__in',
        'posts_per_page' => -1,
    );

    $loop = new WP_Query($args);

    if (!$loop->have_posts()) {
        return '<p>Курсы не найдены. Проверьте правильность ID.</p>';
    }

    ob_start();
    ?>
    <style>
      /* =========================================================
         ATMO Featured Courses — styled to match Home CTA + Quiz
         Palette: accent #20bec4, secondary #7377e3
         Fully isolated within .atmo-featured
      ========================================================= */

      .atmo-featured, .atmo-featured * { box-sizing: border-box; }

      .atmo-featured{
        --atmo-text:#2D2A26;
        --atmo-muted:#7A7571;
        --atmo-accent:#20bec4;
        --atmo-secondary:#7377e3;
        --atmo-border:#E5E7EB;
        --atmo-card:#FFFFFF;
        --atmo-radius:24px;

        margin: 34px 0;
        font-family: Inter, Montserrat, -apple-system, system-ui, Segoe UI, Roboto, Arial, sans-serif;
        color: var(--atmo-text);
      }

      .atmo-featured__grid{
        display:grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      /* Card */
      .atmo-featured__card{
        background: var(--atmo-card);
        border: 1px solid var(--atmo-border);
        border-radius: var(--atmo-radius);
        box-shadow: 0 16px 40px rgba(0,0,0,.06);
        overflow:hidden;
        display:flex;
        flex-direction:column;
        height:100%;
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
      }

      /* Make whole card feel clickable without breaking semantics */
      .atmo-featured__card:hover{
        transform: translateY(-2px);
        box-shadow: 0 18px 44px rgba(0,0,0,.08);
        border-color: rgba(32,190,196,.55);
      }

      .atmo-featured__media{
        position:relative;
        background:
          radial-gradient(700px 220px at 20% 0%, rgba(32,190,196,.14), transparent 55%),
          radial-gradient(520px 220px at 90% 20%, rgba(115,119,227,.16), transparent 55%),
          #F8FAFC;
        aspect-ratio: 16 / 11;
        overflow:hidden;
      }

      .atmo-featured__media img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
        transform: scale(1.001);
        transition: transform .25s ease;
      }
      .atmo-featured__card:hover .atmo-featured__media img{ transform: scale(1.03); }

      /* subtle top gradient for readability if images are bright */
      .atmo-featured__media::after{
        content:"";
        position:absolute;
        inset:0;
        background: linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,0) 55%);
        pointer-events:none;
        opacity:.35;
      }

      .atmo-featured__body{
        padding: 18px 18px 16px;
        display:flex;
        flex-direction:column;
        gap: 10px;
        min-height: 0;
      }

      .atmo-featured__title{
        margin:0;
        font-size: 17px;
        font-weight: 900;
        line-height: 1.25;
        letter-spacing: -0.01em;
      }
      .atmo-featured__title a{
        color: inherit;
        text-decoration:none;
      }
      .atmo-featured__card:hover .atmo-featured__title a{ color: #169297; }

      /* Price */
      .atmo-featured__price{
        margin-top:auto;
        font-size: 18px;
        font-weight: 900;
        color: #1e293b;
        padding-top: 6px;
      }
      .atmo-featured__price .amount { color:#1e293b; font-weight:900; }
      .atmo-featured__price del { font-size: 13px; color:#94a3b8; font-weight:700; margin-right:8px; }
      .atmo-featured__price ins { text-decoration:none; color: var(--atmo-accent); }

      /* CTA button */
      .atmo-featured__btn{
        display:flex;
        align-items:center;
        justify-content:center;
        width:100%;
        margin-top: 12px;
        padding: 13px 14px;
        border-radius: 14px;
        font-weight: 900;
        font-size: 14px;
        text-decoration:none;
        background: var(--atmo-secondary);
        color:#fff !important;
        border: 0;
        transition: transform .15s ease, background .15s ease, box-shadow .15s ease;
        box-shadow: 0 10px 20px rgba(115,119,227,.18);
        min-height: 48px;
      }
      .atmo-featured__btn:hover{
        background:#5a5ec0;
        transform: translateY(-1px);
        box-shadow: 0 14px 26px rgba(115,119,227,.22);
      }

      /* Optional small "pill" label (disabled by default; add class .is-on if you want) */
      .atmo-featured__pill{
        position:absolute;
        top: 12px;
        left: 12px;
        background: rgba(255,255,255,.92);
        border: 1px solid rgba(229,231,235,.9);
        color: rgba(45,42,38,.85);
        font-weight: 900;
        font-size: 11px;
        letter-spacing: .06em;
        padding: 6px 10px;
        border-radius: 999px;
        display:none;
      }
      .atmo-featured__card.is-on .atmo-featured__pill{ display:inline-flex; }

      /* Responsive */
      @media (max-width: 980px){
        .atmo-featured__grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 640px){
        .atmo-featured{ margin: 26px 0; }
        .atmo-featured__grid{ grid-template-columns: 1fr; gap: 14px; }
        .atmo-featured__body{ padding: 16px; }
        .atmo-featured__title{ font-size: 16px; }
        .atmo-featured__btn{ width:100%; }
      }
    </style>

    <div class="atmo-featured">
      <div class="atmo-featured__grid">
        <?php
        while ($loop->have_posts()) : $loop->the_post();
            global $product;

            if (!$product || !is_a($product, 'WC_Product')) {
                continue;
            }

            $product_id    = get_the_ID();
            $product_url   = get_permalink($product_id);
            $product_title = get_the_title($product_id);

            $image_url = get_the_post_thumbnail_url($product_id, 'medium');
            if (!$image_url) $image_url = wc_placeholder_img_src();

            ?>
            <article class="atmo-featured__card">
              <a href="<?php echo esc_url($product_url); ?>" class="atmo-featured__media" aria-label="<?php echo esc_attr($product_title); ?>">
                <span class="atmo-featured__pill">Курс</span>
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($product_title); ?>">
              </a>

              <div class="atmo-featured__body">
                <h3 class="atmo-featured__title">
                  <a href="<?php echo esc_url($product_url); ?>"><?php echo esc_html($product_title); ?></a>
                </h3>

                <div class="atmo-featured__price">
                  <?php echo wp_kses_post($product->get_price_html()); ?>
                </div>

                <a href="<?php echo esc_url($product_url); ?>" class="atmo-featured__btn">Подробнее</a>
              </div>
            </article>
            <?php
        endwhile;
        ?>
      </div>
    </div>
    <?php

    $html = ob_get_clean();
    wp_reset_postdata();
    return $html;
}
```
