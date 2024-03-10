<?php

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPlugin(
    array(
        'News Element',
        'news',
        'EXT:cb_template/Resources/Public/images/backend/icon.svg'
    ),
    'CType',
    'cb_template'
);

$news = [
    'relatedNews' => [
        'exclude' => 1,
        'label' => 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.relatedNews',
        'config' => [
            'type' => 'check',
            'items' => [
                [
                    0 => 'Ja',
                    1 => 'Ja',
                ]
            ],
        ],
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $news);

$GLOBALS['TCA']['tt_content']['types']['news']['showitem'] = '
        --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
               --palette--;;general,
               --palette--;;headers,relatedNews,
                    pages;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:pages.ALT.menu_formlabel,
                --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
                    --palette--;;frames,
                    --palette--;;appearanceLinks,
                --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.accessibility,
                    --palette--;;menu_accessibility,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
                    --palette--;;language,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
                    --palette--;;hidden,
                    --palette--;;access,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
                    categories,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,
                    rowDescription,
                --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
    ';