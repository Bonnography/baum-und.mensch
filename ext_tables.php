<?php

use TYPO3\CMS\Core\DataHandling\PageDoktypeRegistry;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;

defined('TYPO3') or die();

// Define a new doktype
$customPageDoktype = 116;
// Add page type to system
$dokTypeRegistry = GeneralUtility::makeInstance(PageDoktypeRegistry::class);
$dokTypeRegistry->add(
    $customPageDoktype,
    [
        'type' => 'web',
        'allowedTables' => '*',
    ]
);

// Add custom doktype to the page tree toolbar
ExtensionManagementUtility::addUserTSConfig(
    "@import 'EXT:cb_template/Configuration/TsConfig/User/*.tsconfig'"
);

$GLOBALS['TYPO3_CONF_VARS']['SYS']['locallangXMLOverride']['EXT:felogin/Resources/Private/Language/locallang.xlf'][] = 'EXT:cb_template/Resources/Private/Language/locallang_felogin.xlf';