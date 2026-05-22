# Snippet 7: Login Log

> Read-only export from Local `wp_snippets` — **2026-05-22**. Do not edit production DB from this file.

## Metadata

| Field | Value |
|-------|-------|
| ID | 7 |
| Name | Login Log |
| Active | yes (1) |
| Scope | `global` |
| Priority | 10 |
| Modified | 2025-10-14 11:06:12 |
| Tags | — |
| Source file | `snippet-07-login-log.md` |

## Code

```php

/**
 * Login Log: CSV + Admin viewer with pagination and day separators
 * (Финальный вариант с fputcsv, пагинацией и User Agent)
 */

function my_loginlog_file_path() {
    $upload_dir = wp_upload_dir();
    return trailingslashit($upload_dir['basedir']) . 'login-log.csv';
}
function my_loginlog_header_line() {
    return "time,user,ip,country,roles,user_agent\n";
}

/* -------------------------------------------------------------------
 * === 1. Запись успешных логинов в CSV (С ИСПОЛЬЗОВАНИЕМ fputcsv) ===
 * ------------------------------------------------------------------- */
add_action('wp_login', function ($user_login, $user) {
    $file = my_loginlog_file_path();

    $ip      = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
    $country = $_SERVER['HTTP_CF_IPCOUNTRY']       ?? 'Unknown';
    $ua      = $_SERVER['HTTP_USER_AGENT']         ?? '';
    $time    = current_time('mysql');
    $roles   = (is_object($user) && !empty($user->roles)) ? implode('|', $user->roles) : 'unknown';

    // 1. Проверяем наличие файла и записываем заголовок
    if ( ! file_exists($file) ) {
        file_put_contents($file, my_loginlog_header_line(), FILE_APPEND | LOCK_EX);
    }
    
    // 2. Данные для записи. fputcsv() самостоятельно экранирует поля.
    $log_data = [ $time, $user_login, $ip, $country, $roles, $ua ];

    // 3. Используем fputcsv для безопасной записи
    $fh = @fopen($file, 'a');
    if ( $fh ) {
        fputcsv($fh, $log_data); 
        fclose($fh);
    }

    // 4. Лог-ротация: держим последние 100 записей (+ заголовок)
    $rows = @file($file, FILE_IGNORE_NEW_LINES);
    if ($rows && count($rows) > 101) {
        $head = array_shift($rows);
        $rows = array_slice($rows, -100);
        
        // Перезаписываем файл, сохраняя заголовок и последние 100 строк
        file_put_contents($file, $head . "\n" . implode("\n", $rows) . "\n", LOCK_EX);
    }
}, 10, 2);

/* -----------------------------------------------
 * === 2. Админ-страница: Инструменты → Login Log ===
 * ----------------------------------------------- */
add_action('admin_menu', function () {
    add_management_page(
        'Login Log',
        'Login Log',
        'manage_options',
        'login-log',
        function () {
            if ( ! current_user_can('manage_options') ) {
                wp_die('Insufficient permissions');
            }

            $file = my_loginlog_file_path();

            // Ссылки действий
            $download_url = wp_nonce_url(
                admin_url('admin-post.php?action=download_login_log'),
                'download_login_log'
            );
            $clear_url = wp_nonce_url(
                admin_url('admin-post.php?action=clear_login_log'),
                'clear_login_log'
            );

            // UI
            echo '<div class="wrap"><h1>Login Log</h1>';
            if (!empty($_GET['cleared'])) {
                echo '<div class="notice notice-success"><p>Login log cleared.</p></div>';
            }
            echo '<p><a href="' . esc_url($download_url) . '" class="button button-primary">Download CSV</a> ';
            echo '<a href="' . esc_url($clear_url) . '" class="button" id="loginlog-clear-btn">Clear Log</a></p>';

            // Локализованное подтверждение очистки
            $confirm_msg = esc_js(
                __('Clear the login log? This action is irreversible.', 'my-textdomain') // Используйте свой textdomain
            );
            // Если локализация не нужна: 'Очистить журнал логинов? Действие необратимо.'

            echo '<script>
                (function(){
                    const btn=document.getElementById("loginlog-clear-btn");
                    if(btn){btn.addEventListener("click",function(e){
                        if(!confirm("' . $confirm_msg . '")){e.preventDefault();}
                    });}
                })();
            </script>';

            if ( ! file_exists($file) ) { echo '<p>No logins recorded yet.</p></div>'; return; }

            // Чтение CSV файла. file() используется для удобства.
            $rows_all = array_map('str_getcsv', file($file));
            
            // Проверка, что файл не пуст
            if (empty($rows_all)) { echo '<p>No activity recorded yet.</p></div>'; return; }

            $header = array_shift($rows_all);
            
            // Если файл содержит только заголовок
            if (empty($rows_all)) { echo '<p>No activity recorded yet.</p></div>'; return; }
            
            // Сортируем так, чтобы новые были сверху (по дате/времени)
            usort($rows_all, function($a, $b) {
                // Предполагаем, что time (индекс 0) всегда присутствует
                $ta = strtotime($a[0] ?? '');
                $tb = strtotime($b[0] ?? '');
                return $tb <=> $ta; // новое → старое
            });


            // --- ПАГИНАЦИЯ ---
            $per_page = 50; 
            $total_items = count($rows_all);
            $total_pages = max(1, (int)ceil($total_items / $per_page));
            $paged = isset($_GET['paged']) ? max(1, (int)$_GET['paged']) : 1;
            if ($paged > $total_pages) { $paged = $total_pages; }
            $offset = ($paged - 1) * $per_page;

            $rows = array_slice($rows_all, $offset, $per_page);

            // Стили
            echo '<style>
                .loginlog-table .admin-row { font-weight:600; }
                .loginlog-badge { display:inline-block; padding:2px 6px; border-radius:4px; background:#CCF; color:#003; font-size:11px; margin-left:6px; }
                .loginlog-badge.admin { background:#FDD; color:#900; }
                .loginlog-mono { font-family: ui-monospace, Menlo, Consolas, monospace; font-size:12px; }
                .loginlog-ua { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .log-date-separator th { background:#f3f4f6; color:#333; border-top:2px solid #ddd; padding:8px 10px; }
                .tablenav-pages { margin: 10px 0; }
            </style>';

            // Пагинация (верх)
            $base_url = remove_query_arg('paged');
            $page_links = paginate_links(array(
                'base'      => add_query_arg('paged', '%#%', $base_url),
                'format'    => '',
                'prev_text' => '«',
                'next_text' => '»',
                'total'     => $total_pages,
                'current'   => $paged,
            ));
            if ($total_pages > 1) {
                echo '<div class="tablenav top"><div class="tablenav-pages">' . $page_links . '</div></div>';
            }

            // Таблица: time, user, ip, country, user_agent (новый столбец), roles (последний)
            $display_header = ['time', 'user', 'ip', 'country', 'user_agent', 'roles'];
            $colspan_count = count($display_header); // Будет 6

            echo '<table class="widefat fixed striped loginlog-table"><thead><tr>';
            foreach ($display_header as $col) {
                echo '<th>' . esc_html($col) . '</th>';
            }
            echo '</tr></thead><tbody>';

            // Группировка по дням
            $current_date = '';
            foreach ($rows as $r) {
                // array_pad на случай неполных/старых строк CSV (хотя fputcsv это исправит)
                $r = array_pad($r, 6, ''); 
                list($time, $user, $ip, $country, $roles, $ua) = $r;
                $log_date = substr($time, 0, 10); // YYYY-MM-DD

                if ($log_date !== $current_date) {
                    echo '<tr class="log-date-separator"><th colspan="' . $colspan_count . '">'
                        . '📅 ' . esc_html( date_i18n('j F Y', strtotime($log_date)) )
                        . '</th></tr>';
                    $current_date = $log_date;
                }

                $is_admin = (strpos($roles, 'administrator') !== false);
                $tr_class = $is_admin ? ' class="admin-row"' : '';

                echo "<tr{$tr_class}>";
                echo '<td>' . esc_html($time) . '</td>';
                echo '<td>' . esc_html($user);
                if ($is_admin) {
                    echo ' <span class="loginlog-badge admin">admin</span>';
                } elseif (!empty($roles)) {
                    // Отображаем основную роль в бейдже
                    echo ' <span class="loginlog-badge">' . esc_html(explode('|', $roles)[0]) . '</span>';
                }
                echo '</td>';
                echo '<td class="loginlog-mono">' . esc_html($ip) . '</td>';
                echo '<td>' . esc_html($country) . '</td>';
                // Новый столбец User Agent
                echo '<td class="loginlog-mono loginlog-ua" title="' . esc_attr($ua) . '">' . esc_html($ua) . '</td>';
                // Столбец Roles
                echo '<td>' . esc_html($roles) . '</td>';
                echo '</tr>';
            }

            echo '</tbody></table>';

            // Пагинация (низ)
            if ($total_pages > 1) {
                echo '<div class="tablenav bottom"><div class="tablenav-pages">' . $page_links . '</div></div>';
            }

            echo '</div>'; // .wrap
        }
    );
});

/* -----------------------------
 * === 3. Скачивание CSV ===
 * ----------------------------- */
add_action('admin_post_download_login_log', function () {
    if ( ! current_user_can('manage_options') ) { wp_die('Insufficient permissions'); }
    check_admin_referer('download_login_log');

    $file = my_loginlog_file_path();
    if ( ! file_exists($file) ) { wp_die('Log file not found'); }

    nocache_headers();
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=login-log-' . date('Ymd-His') . '.csv');
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
});

/* -------------------------
 * === 4. Очистка лога ===
 * ------------------------- */
add_action('admin_post_clear_login_log', function () {
    if ( ! current_user_can('manage_options') ) { wp_die('Insufficient permissions'); }
    check_admin_referer('clear_login_log');

    $file = my_loginlog_file_path();
    // Удаляем файл, затем создаем пустой с заголовком
    if (file_exists($file)) { @unlink($file); }
    file_put_contents($file, my_loginlog_header_line(), LOCK_EX);

    wp_safe_redirect(add_query_arg('cleared', '1', admin_url('tools.php?page=login-log')));
    exit;
});
```
