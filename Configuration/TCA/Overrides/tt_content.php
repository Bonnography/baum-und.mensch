<?php
/**
 * Created by PhpStorm.
 * User: BenjaminBomberg
 * Date: 10.03.2020
 * Time: 10:59
 */

use TYPO3\CMS\Extbase\Utility\ExtensionUtility;

defined('TYPO3') or die();

// include misc
//include_once('path-to-file.php');
include_once('misc/remove_bottom_space.php');
include_once('misc/button_style.php');

// include ContentElements
//include_once('path-to-file.php');
include_once('ContentElements/headerImage.php');
include_once('ContentElements/news.php');
include_once('ContentElements/inlineElements.php');
include_once('ContentElements/headline.php');
include_once('ContentElements/image.php');
include_once('ContentElements/text.php');

(static function (): void {
    ExtensionUtility::registerPlugin(
    // extension name, matching the PHP namespaces (but without the vendor)
        'CbTemplate',
        // arbitrary, but unique plugin name (not visible in the backend)
        'ConcertsDb',
        // plugin title, as visible in the drop-down in the backend, use "LLL:" for localization
        'Concerts DB',
        // icon
        'apps-clipboard-list'
    );
})();


$switchConcertsAction = [
    'switch' => [
        'exclude' => 1,
        'label' => 'Action',
        'onChange' => 'reload',
        'config' => [
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                ['List actual concerts', 0],
                ['List old concerts', 1],
            ],
        ],
    ],
];
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $switchConcertsAction);

$GLOBALS['TCA']['tt_content']['types']['list']['subtypes_addlist']["cbtemplate_concertsdb"]="switch";
$GLOBALS['TCA']['tt_content']['ctrl']['label_alt'] = 'headline, bodytext';

call_user_func(function () {

});
