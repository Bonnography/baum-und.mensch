<?php

$header_position = [
    'header_position' => [
        'exclude' => 1,
        'label' => 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.header_position',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['Left', '0'],
                ['Center', '1'],
                ['Right', '2'],
            ],
        ],
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $header_position);