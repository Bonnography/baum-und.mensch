<?php

namespace CodebombWebsolutions\CbTemplate\ViewHelpers;


use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

class ArrayUniqueViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments()
    {
        $this->registerArgument('array', 'array', true);
        $this->registerArgument('field', 'string', true);
    }

    public function render()
    {
        $newArr = [];
        $array = $this->arguments['array'];
        $field = $this->arguments['field'];

        foreach ($array as $arr) {
            switch ($field) {
                case 'date':
                    array_push($newArr, date('Y', strtotime($arr->getDate())));
                    break;
                case 'categories':
                    foreach ($arr->getCategories() as $category) {
                        array_push($newArr, $category->getTitle());
                    }
                    break;
            }

        }
        return array_unique($newArr);
    }
}