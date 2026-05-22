# Snippet 11: Courses Carousel for mainpage

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 11 |
| Name | Courses Carousel for mainpage |
| Active | no (0) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-02-22 09:13:30 |
| Tags | — |
| Source file | `snippet-11-courses-carousel-for-mainpage.md` |

## Code

```php
add_shortcode('featured_courses', 'custom_featured_courses_shortcode');

function custom_featured_courses_shortcode($atts) {
    $a = shortcode_atts(array(
        'ids' => '', // Здесь будут ID товаров через запятую
    ), $atts);

    if (empty($a['ids'])) {
        return '<p>Пожалуйста, укажите ID курсов. Например: [featured_courses ids="10,15,22,45,50"]</p>';
    }

    // Очищаем ID от пробелов
    $product_ids = array_map('trim', explode(',', $a['ids']));

    // Запрашиваем товары из базы WooCommerce
    $args = array(
        'post_type'      => 'product',
        'post__in'       => $product_ids,
        'orderby'        => 'post__in', // Сохраняем тот порядок, в котором вы вписали ID
        'posts_per_page' => -1,
    );

    $loop = new WP_Query($args);

    if (!$loop->have_posts()) {
        return '<p>Курсы не найдены. Проверьте правильность ID.</p>';
    }

    // Начинаем собирать HTML
    ob_start();
    ?>
    <style>
        .custom-products-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 24px;
            margin: 40px 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .custom-product-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .custom-product-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-color: #00d3ce;
        }
        .custom-product-image {
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 16px;
            aspect-ratio: 1 / 1;
            background: #f8fafc;
        }
        .custom-product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
        }
        .custom-product-card:hover .custom-product-image img {
            transform: scale(1.03);
        }
        .custom-product-title {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 12px 0;
            line-height: 1.4;
        }
        .custom-product-title a {
            color: inherit;
            text-decoration: none;
            transition: color 0.2s ease;
        }
        .custom-product-card:hover .custom-product-title a {
            color: #00d3ce;
        }
        .custom-product-price {
            font-size: 20px;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 20px;
            margin-top: auto; /* Всегда прижимает цену и кнопку к низу карточки */
        }
        /* Сбрасываем стили WooCommerce внутри нашей карточки для чистоты */
        .custom-product-price .amount { color: #1e293b; font-weight: 800; }
        .custom-product-price del { font-size: 14px; color: #94a3b8; font-weight: 500; margin-right: 8px; }
        .custom-product-price ins { text-decoration: none; color: #00d3ce; }
        
        .custom-product-button {
            display: block;
            width: 100%;
            text-align: center;
            background-color: #7377e3;
            color: #ffffff;
            padding: 12px 0;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: background-color 0.2s ease;
            font-size: 15px;
        }
        .custom-product-button:hover {
            background-color: #1aa6ab;
            color: #ffffff;
        }
    </style>

    <div class="custom-products-grid">
        <?php
        while ($loop->have_posts()) : $loop->the_post();
            global $product;
            $product_url   = get_permalink();
            $product_title = get_the_title();
            // Получаем картинку товара
            $image_url = get_the_post_thumbnail_url(get_the_ID(), 'medium');
            if (!$image_url) {
                $image_url = wc_placeholder_img_src(); // Картинка-заглушка, если нет фото
            }
            ?>
            <div class="custom-product-card">
                <a href="<?php echo esc_url($product_url); ?>" class="custom-product-image">
                    <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($product_title); ?>">
                </a>
                <h3 class="custom-product-title">
                    <a href="<?php echo esc_url($product_url); ?>"><?php echo esc_html($product_title); ?></a>
                </h3>
                <div class="custom-product-price">
                    <?php echo $product->get_price_html(); ?>
                </div>
                <a href="<?php echo esc_url($product_url); ?>" class="custom-product-button">Подробнее</a>
            </div>
            <?php
        endwhile;
        ?>
    </div>

    <?php
    $html = ob_get_clean();
    wp_reset_postdata(); // Возвращаем WordPress в нормальное состояние
    return $html;
}
```
