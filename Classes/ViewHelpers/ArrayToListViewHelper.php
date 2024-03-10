<?php

namespace CodebombWebsolutions\CbTemplate\ViewHelpers;


use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

class ArrayToListViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function initializeArguments()
    {
        $this->registerArgument('array', 'array', true);
    }

    public function render() {
        $newArr = [];
        $array = $this->arguments['array'];

        foreach ($array as $arr)
        {
            array_push($newArr, $arr->getTitle());
        }
        return (implode(',', $newArr));
    }
}