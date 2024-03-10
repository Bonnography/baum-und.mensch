<?php

/**
 * Extension Manager/Repository config file for ext "cb_template".
 */
$_EXTKEY = 'cb_template';
$EM_CONF[$_EXTKEY] = [
    'title' => 'CB Template',
    'description' => '',
    'category' => 'templates',
    'constraints' => [
        'depends' => [
            'typo3' => '12.4.0-12.4.99',
            'fluid_styled_content' => '12.4.0-12.4.99',
            'rte_ckeditor' => '12.4.0-12.4.99',
        ],
        'conflicts' => [
        ],
    ],
    'autoload' => [
        'psr-4' => [
            'CodebombWebsolutions\\CbTemplate\\' => 'Classes',
        ],
    ],
    'state' => 'stable',
    'uploadfolder' => 0,
    'createDirs' => '',
    'clearCacheOnLoad' => 1,
    'author' => 'Benjamin Bomberg',
    'author_email' => 'benjamin.bomberg@codebomb-websolutions.de',
    'author_company' => 'Codebomb Websolutions',
    'version' => '12.4.0',
];
