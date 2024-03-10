<?php

declare(strict_types=1);

namespace CodebombWebsolutions\CbTemplate\Controller;

use CodebombWebsolutions\CbTemplate\Domain\Repository\ConcertsRepository;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
use TYPO3\CMS\Extbase\Persistence\Generic\Typo3QuerySettings;

class ConcertsController extends ActionController
{

    protected $responseFactory;
    protected $streamFactory;

    protected ConcertsRepository $concertsRepository;

    /**
     * ConcertsController constructor.
     * @param ConcertsRepository $concertsRepository
     */

    public function injectConcertsRepository(ConcertsRepository $concertsRepository): void
    {
        $this->concertsRepository = $concertsRepository;
    }
    public function listAction(): ResponseInterface
    {
        $GLOBALS['TSFE']->addCacheTags(['concerts_list']);
        $querySettings = GeneralUtility::makeInstance(Typo3QuerySettings::class);
        $querySettings->setRespectStoragePage(false);
        $this->concertsRepository->setDefaultQuerySettings($querySettings);
        $data = $this->configurationManager->getContentObject()->data;
        $this->view->assign('data', $data);
        if ( $data['switch'] === 0 ) {
            $items = $this->concertsRepository->findAllComing();
        } else {
            $items = $this->concertsRepository->findAllOld();
        }
        $this->view->assign('items', $items);

        return $this->responseFactory->createResponse()
            ->withAddedHeader('Content-Type', 'text/html; charset=utf-8')
            ->withBody($this->streamFactory->createStream($this->view->render()));
    }
}