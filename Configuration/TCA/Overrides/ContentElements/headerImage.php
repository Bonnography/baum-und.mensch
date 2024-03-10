<?php
/**
 * Created by PhpStorm.
 * User: bbom
 * Date: 17.04.2018
 * Time: 10:34
 */

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPlugin(
    array(
        'Header Image',
        'headerImage',
        'EXT:cb_template/Resources/Public/images/backend/icon.svg'
    ),
    'CType',
    'cb_template'
);

$headerImage = [
    'header_text_position' => [
        'exclude' => 1,
        'label' => 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.header_text_position',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['Top', '0'],
                ['Top-Center', '1'],
                ['Center', '2'],
                ['Center-Center', '3'],
                ['Bottom', '4'],
                ['Bottom-Center', '5'],
            ],
        ],
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $headerImage);

$GLOBALS['TCA']['tt_content']['types']['headerImage']['showitem'] = '
  --div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
                    --palette--;;general,
                --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.images,
                    image, 
                --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
                    --palette--;;frames,
                    --palette--;;appearanceLinks,
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