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


$GLOBALS['TCA']['tt_content']['ctrl']['label_alt'] = 'headline, bodytext';

call_user_func(function () {

});
