<?php
/* Contadores agregados sin cookies, IPs ni datos personales.
 * Requiere PHP 8.x y permiso de escritura en este directorio.
 */
declare(strict_types=1);

function tch_counts(?string $increment = null): array {
    $directory = __DIR__ . '/.tch-data';
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) {
        throw new RuntimeException('Counter storage unavailable');
    }
    // El prefijo PHP protege el contenido incluso si el servidor ignora .htaccess.
    $filename = $directory . '/totals.php';
    $prefix = "<?php exit; ?>\n";
    $lock = @fopen($directory . '/counter.lock', 'c');
    if ($lock === false) { throw new RuntimeException('Counter lock unavailable'); }
    $temporary = null;
    try {
        if (!flock($lock, LOCK_EX)) { throw new RuntimeException('Lock failed'); }
        $counts = ['visits' => 0, 'downloads' => 0];
        if (is_file($filename)) {
            $raw = file_get_contents($filename);
            if ($raw === false || substr($raw, 0, strlen($prefix)) !== $prefix) {
                throw new RuntimeException('Counter storage invalid');
            }
            $counts = json_decode(substr($raw, strlen($prefix)), true, 512, JSON_THROW_ON_ERROR);
            foreach (['visits', 'downloads'] as $key) {
                if (!isset($counts[$key]) || !is_int($counts[$key]) || $counts[$key] < 0) {
                    throw new RuntimeException('Counter storage invalid');
                }
            }
        }
        if ($increment !== null) {
            if (!in_array($increment, ['visits', 'downloads'], true)) { throw new RuntimeException('Invalid counter'); }
            if ($counts[$increment] >= 9007199254740990) { throw new RuntimeException('Counter limit'); }
            $counts[$increment]++;
        }
        if ($increment !== null || !is_file($filename)) {
            $temporary = tempnam($directory, 'count-');
            if ($temporary === false) { throw new RuntimeException('Temporary storage unavailable'); }
            $payload = $prefix . json_encode($counts, JSON_THROW_ON_ERROR);
            if (file_put_contents($temporary, $payload) !== strlen($payload) || !rename($temporary, $filename)) {
                throw new RuntimeException('Counter save failed');
            }
            $temporary = null;
        }
        return $counts;
    } finally {
        if (is_string($temporary) && is_file($temporary)) { @unlink($temporary); }
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function tch_same_site(): bool {
    $site = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
    if ($site === 'cross-site') { return false; }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $host = parse_url($origin, PHP_URL_HOST);
        $requestHost = parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST);
        if (!is_string($host) || !is_string($requestHost) || strtolower($host) !== strtolower($requestHost)) { return false; }
    }
    return true;
}

if (!defined('TCH_COUNTER_LIBRARY')) {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');
    header('X-Content-Type-Options: nosniff');
    $action = $_GET['action'] ?? 'stats';
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!is_string($action) || !in_array($action, ['stats', 'visit'], true)) {
        http_response_code(400); echo '{"ok":false}'; exit;
    }
    if (($action === 'stats' && $method !== 'GET') || ($action === 'visit' && $method !== 'POST')) {
        http_response_code(405); header('Allow: ' . ($action === 'stats' ? 'GET' : 'POST')); echo '{"ok":false}'; exit;
    }
    if (!tch_same_site()) { http_response_code(403); echo '{"ok":false}'; exit; }
    try {
        $counts = tch_counts($action === 'visit' ? 'visits' : null);
        echo json_encode(['ok' => true] + $counts, JSON_THROW_ON_ERROR);
    } catch (Throwable $error) {
        http_response_code(503); echo '{"ok":false}';
    }
}
