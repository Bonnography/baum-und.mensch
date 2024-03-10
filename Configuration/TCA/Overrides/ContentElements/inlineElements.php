<?php
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPlugin(
    array(
        'Inline Elements',
        'inlineElements',
        'EXT:cb_template/Resources/Public/images/backend/icon.svg'
    ),
    'CType',
    'cb_template'
);
$inlineElements = [
    'inline_layout' => [
        'exclude' => 1,
        'label' => 'Layout',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'eval' => 'required',
            'items' => [
                ['Carousel', 0],
                ['2 Spaltig', 1],
                ['3 Spaltig', 2],
            ],
        ],
    ],
    'inline_item_header' => [
        'exclude' => 1,
        'label' => 'Header',
        'config' => [
            'type' => 'input',
            'size' => 50,
            'max' => 255,
        ],
    ],
    'image' => [
        'label' => 'My image',
        'config' => [
            'type' => 'file',
            'allowed' => 'common-image-types'
        ],
    ],
    'image_position' => [
        'exclude' => 1,
        'label' => 'Bildposition',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'eval' => 'required',
            'items' => [
                ['Top', 0],
                ['Bottom', 1],
            ],
        ],
    ],
    'cta' => [
        'exclude' => 1,
        'label' => 'CTA',
        'config' => [
            'type' => 'input',
            'renderType' => 'inputLink',
        ],
    ],
    'cta_text' => [
        'exclude' => 1,
        'label' => 'CTA Text',
        'config' => [
            'type' => 'input',
            'max' => 256,
        ],
    ],
    'inline_item' => [
        'exclude' => true,
        'label' => 'Card',
        'config' => [
            'type' => 'inline',
            'foreign_table' => 'tt_content',
            'foreign_field' => 'inline_item_container',
            'foreign_label' => 'inline_item_header',
            'maxitems' => 999,
            'foreign_record_defaults' => array(
                'colPos' => '999',
                'CType' => 'text',
            ),
            'overrideChildTca' => [
                'columns' => [
                    'CType' => [
                        'config' => [
                            'default' => 'text',
                        ],
                    ],
                    'colPos' => [
                        'config' => [
                            'default' => 999
                        ]
                    ],
                ],
                'types' => [
                    'text' => [
                        'showitem' =>
                            '--palette--;LLL:EXT:cb_template/Resources/Private/Language/locallang_tca.xlf:inline_item;item_palette,',
                    ],
                ],
            ],
        ],
    ],
];
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $inlineElements);

$GLOBALS['TCA']['tt_content']['palettes']['item_palette']['showitem'] = '
     colPos, sys_language_uid, l10n_parent,
    --linebreak--,
    image,
    --linebreak--,
    image_position,
      --linebreak--,
    inline_item_header,
    --linebreak--,
    bodytext;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:bodytext_formlabel,
    --linebreak--, 
    cta, cta_text, button_style,
';


$GLOBALS['TCA']['tt_content']['types']['inlineElements']['showitem'] = '
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:general,
    --palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.general;general,
    --palette--;;headers,inline_layout,inline_item,
--div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.appearance,
--palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.frames;frames,
--palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.appearanceLinks;appearanceLinks,
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:language,
--palette--;;language,
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:access,
--palette--;;hidden,
--palette--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:palette.access;access,
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:categories,
--div--;LLL:EXT:lang/Resources/Private/Language/locallang_tca.xlf:sys_category.tabs.category,categories,
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:notes,rowDescription,
--div--;LLL:EXT:core/Resources/Private/Language/Form/locallang_tabs.xlf:extended,
';