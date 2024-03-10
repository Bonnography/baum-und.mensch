<?php

$remove_bottom_space = [
    'remove_bottom_space' => [
        'exclude' => 1,
        'label' => 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.removeBottomSpace',
        'config' => [
            'type' => 'check',
            'items' => [
                // label, value
                ['LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.removeBottomSpace.check', 'LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:tt_content.removeBottomSpace.check'],
            ],
        ]
    ],
];

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $remove_bottom_space);