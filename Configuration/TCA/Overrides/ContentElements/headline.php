<?php
/**
 * Created by PhpStorm.
 * User: bbom
 * Date: 17.04.2018
 * Time: 10:34
 */

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPlugin(
    array(
        'Headline',
        'headline',
        'EXT:cb_template/Resources/Public/images/backend/icon.svg'
    ),
    'CType',
    'cb_template'
);

$headline = [
    'headline' => [
        'exclude' => 1,
        'label' => 'Headline',
        'config' => [
            'type' => 'text',
            'rows' => 3,
            'cols' => 30,
            'enableRichtext' => true,
            'richtextConfiguration' => 'teaser'
        ],
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $headline);

$GLOBALS['TCA']['tt_content']['types']['headline']['showitem'] = '
         --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                    --palette--;;general,headline,remove_bottom_space,
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