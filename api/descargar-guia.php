<?php
declare(strict_types=1);
define('TCH_COUNTER_LIBRARY', true);
require __DIR__ . '/contador.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if (!in_array($method, ['GET', 'HEAD'], true)) {
    http_response_code(405); header('Allow: GET, HEAD'); exit;
}
if (!tch_same_site()) { http_response_code(403); exit; }
$file = dirname(__DIR__) . '/descargas/guia-todos-con-hernan.pdf';
$handle = @fopen($file, 'rb');
if ($handle === false) { http_response_code(404); exit('El libro no está disponible.'); }

if ($method === 'GET') {
    try { tch_counts('downloads'); } catch (Throwable $error) { /* La descarga sigue disponible si falla el registro. */ }
}
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Suiza-empezar-de-nuevo-Todos-con-Hernan.pdf"');
header('Content-Length: ' . (string)filesize($file));
header('Cache-Control: private, no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
if ($method === 'GET') { fpassthru($handle); }
fclose($handle);
