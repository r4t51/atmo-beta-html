# Snippet 17: Before&After for 33_Pelvic Floor

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 17 |
| Name | Before&After for 33_Pelvic Floor |
| Active | no (-1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2026-04-28 09:24:26 |
| Tags | — |
| Source file | `snippet-17-before-after-for-33-pelvic-floor.md` |

## Code

```php
// 1. Создаем таблицу в базе при активации
add_action('after_switch_theme', 'my_custom_checklist_table');
function my_custom_checklist_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_checklists';
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) NOT NULL,
        test_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        answers text NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

// 2. Обработка сохранения ответов через AJAX
add_action('wp_ajax_save_checklist', 'save_checklist_callback');
function save_checklist_callback() {
    global $wpdb;
    if (!is_user_logged_in()) wp_send_json_error('Нужна авторизация');
    
    $table_name = $wpdb->prefix . 'user_checklists';
    $wpdb->insert($table_name, [
        'user_id' => get_current_user_id(),
        'answers' => json_encode($_POST['answers'], JSON_UNESCAPED_UNICODE)
    ]);
    wp_send_json_success();
}
// Вывод прошлых ответов (ДО) с помощью шорткода
add_shortcode('get_checklist_do', 'get_checklist_do_script');
function get_checklist_do_script() {
    if (!is_user_logged_in()) return '';
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_checklists';
    $user_id = get_current_user_id();
    
    // Ищем самую первую запись клиентки (сортировка по дате по возрастанию)
    $old_data = $wpdb->get_var($wpdb->prepare(
        "SELECT answers FROM $table_name WHERE user_id = %d ORDER BY test_date ASC LIMIT 1", 
        $user_id
    ));
    
    if(!$old_data) $old_data = '{}';
    
    // Передаем данные в JavaScript
    return "<script>var oldChecklistData = $old_data;</script>";
}
```
