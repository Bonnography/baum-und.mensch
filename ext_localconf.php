<?php

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Core\Http\ApplicationType;
use TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

defined('TYPO3') or die();
/***************
 * Add default RTE configuration
 */
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['default'] = 'EXT:cb_template/Configuration/RTE/Default.yaml';
$GLOBALS['TYPO3_CONF_VARS']['RTE']['Presets']['teaser'] = 'EXT:cb_template/Configuration/RTE/Teaser.yaml';

/***************
 * PageTS
 */
ExtensionManagementUtility::addPageTSConfig('<INCLUDE_TYPOSCRIPT: source="FILE:EXT:cb_template/Configuration/TsConfig/Page/All.tsconfig">');
// Add custom doktype to the page tree toolbar
ExtensionManagementUtility::addUserTSConfig(
    "@import 'EXT:cb_template/Configuration/TsConfig/User/*.tsconfig'"
);
ExtensionUtility::configurePlugin(
    'CbTemplate',
    // arbitrary, but unique plugin name (not visible in the backend)
    'ConcertsDb',
    [
        \CodebombWebsolutions\CbTemplate\Controller\ConcertsController::class => 'list, old'
    ],
);