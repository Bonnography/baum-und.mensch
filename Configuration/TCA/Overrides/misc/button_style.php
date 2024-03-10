<?php

$button_style = [
    'button_style' => [
        'exclude' => 1,
        'label' => 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.button_style',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['Primär', '0'],
                ['Sekundär', '1'],
            ],
        ],
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $button_style);