<?php
namespace CodebombWebsolutions\CbTemplate\DataProcessing;

/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

use TYPO3\CMS\Frontend\ContentObject\ContentObjectRenderer;
use TYPO3\CMS\Frontend\ContentObject\DataProcessorInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;

/**
 * Class for data processing for the content element "My new content element"
 */
class ChildContentElementProcessor implements DataProcessorInterface
{

    /**
     * Process data for the content element "My new content element"
     *
     * @param   ContentObjectRenderer     $cObj                           The data of the content element or page
     * @param   array                     $contentObjectConfiguration     The configuration of Content Object
     * @param   array                     $processorConfiguration         The configuration of this processor
     * @param   array                     $processedData                  Key/value store of processed data (e.g. to be passed to a Fluid View)
     * @return  array                                                    the processed data as key/value store
     */
    public function process(
        ContentObjectRenderer $cObj,
        array $contentObjectConfiguration,
        array $processorConfiguration,
        array $processedData
    )
    {
        $table = $processorConfiguration['references.']['table'];
        $fieldName = $processorConfiguration['references.']['fieldName'];

        $irreElements = $cObj->getRecords(
            $table,
            [
                'where' => $fieldName.'='.$cObj->data['uid'],
                'orderBy' => 'sorting'
            ]
        );

        $targetVariableName = $cObj->stdWrapValue('as', $processorConfiguration);
        $targetVariableNameFiles = $cObj->stdWrapValue('as', $processorConfiguration).'Files';

        $fileRepository = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Resource\FileRepository::class);

        foreach ($irreElements as $key => $irreElement){
            $irreElements[$key]['images'] = [];
//            \TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($key,'key');
//            \TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($irreElement,'single');
            $fileObjects = $fileRepository->findByRelation('tt_content', 'image', $irreElement['uid']);
//            \TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($fileObjects,'files');
            foreach ($fileObjects as $fileObject) {
                array_push($irreElements[$key]['images'],$fileObject);
            }
            $irreElements[$key]['media'] = [];
            $fileObjects = $fileRepository->findByRelation('tt_content', 'media', $irreElement['uid']);
            foreach ($fileObjects as $fileObject) {
                array_push($irreElements[$key]['media'],$fileObject);
            }
            $irreElements[$key]['icons'] = [];
            $fileObjects = $fileRepository->findByRelation('tt_content', 'icons', $irreElement['uid']);
            foreach ($fileObjects as $fileObject) {
                array_push($irreElements[$key]['icons'],$fileObject);
            }
        }
//        \TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($irreElements,'irre');



//        debug($targetVariableNameFiles);


        $processedData[$targetVariableName] = $irreElements;

//        \TYPO3\CMS\Extbase\Utility\DebuggerUtility::var_dump($processedData,'processeddata');





        return $processedData;



//        $this->contentObj = $this->configurationManager->getContentObject();
//        $images=$this->getFileReferences($this->contentObj->data['uid']);
//        $this->view->assign('images', $images);
    }

}