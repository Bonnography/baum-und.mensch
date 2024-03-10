<?php

namespace CodebombWebsolutions\CbTemplate\ViewHelpers;


use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;

class ApplicationContextViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    public function render() {
        $applicationContext = \TYPO3\CMS\Core\Core\Environment::getContext();
        return $applicationContext;
    }
}