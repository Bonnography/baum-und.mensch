<?php
defined('TYPO3') or die();
call_user_func(function()
{
    /**
     * Temporary variables
     */
    $extensionKey = 'cb_template';

    /**
     * Default PageTS for CbTemplate
     */
    \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::registerPageTSConfigFile(
        $extensionKey,
        'Configuration/TsConfig/Page/All.tsconfig',
        'CB Template'
    );
});

// encapsulate all locally defined variables
(function () {
    // SAME as registered in ext_tables.php
    $customPageDoktype = 116;
    $customIconClass = 'actions-document-localize';

    // Add the new doktype to the page type selector
    $GLOBALS['TCA']['pages']['columns']['doktype']['config']['items'][] = [
        'News',
        $customPageDoktype,
        $customIconClass,
        'default',
    ];
    $GLOBALS['TCA']['pages']['types'][116]['showitem'] = '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general, --palette--;;standard, --palette--;;title,newsTeaser, 
        --div--;LLL:EXT:seo/Resources/Private/Language/locallang_tca.xlf:pages.tabs.seo, --palette--;;seo, --palette--;;robots, 
        --palette--;;canonical, --palette--;;sitemap, --div--;LLL:EXT:seo/Resources/Private/Language/locallang_tca.xlf:pages.tabs.socialmedia, 
        --palette--;;opengraph, --palette--;;twittercards, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_tca.xlf:pages.tabs.metadata, 
        --palette--;;abstract, --palette--;;metatags, --palette--;;editorial, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_tca.xlf:pages.tabs.appearance, 
        --palette--;;layout, --palette--;;replace, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_tca.xlf:pages.tabs.behaviour, --palette--;;links, 
        --palette--;;caching, --palette--;;miscellaneous, --palette--;;module, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_tca.xlf:pages.tabs.resources, 
        --palette--;;media, --palette--;;config, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language, --palette--;;language, 
        --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_tca.xlf:pages.tabs.access, --palette--;;visibility, --palette--;;access, 
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories, categories, --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes, rowDescription, 
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
    ';
    // Add the icon to the icon class configuration
    $GLOBALS['TCA']['pages']['ctrl']['typeicon_classes'][$customPageDoktype] = 'actions-document-localize';
})();

// Configure new fields:
$fields = [
    'newsTeaser' => [
        'exclude' => 1,
        'label' => 'News Teaser',
        'config' => [
            'type' => 'text',
            'rows' => 3,
            'cols' => 30,
            'enableRichtext' => true,
            'richtextConfiguration' => 'teaser'
        ],
    ],
];

// Add new fields to pages:
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('pages', $fields);
