<?php

namespace CodebombWebsolutions\CbTemplate\Domain\Repository;


use TYPO3\CMS\Extbase\Persistence\Repository;

/***
 *
 * This file is part of the "Cb Template" Concerts Plugin for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 *  (c) 2023 Benjamin Bomberg <benjamin.bomberg@codebomb-websolutions.de>, Codebomb Websolutions
 *
 ***/

/**
 * The repository for Concerts
 */
class ConcertsRepository extends Repository
{

    public function findAllComing()
    {
        $query = $this->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(FALSE);
        $query->setOrderings(array("date" => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING));
        $date = new \DateTime('midnight');
        $query->matching(
            $query->greaterThanOrEqual('date', $date->format('Y-m-d'))
        );
        return $query->execute();
    }

    public function findAllOld()
    {
        $query = $this->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(FALSE);
        $query->setOrderings(array("date" => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_DESCENDING));
        $date = new \DateTime('midnight');
        $query->matching(
            $query->lessThan('date', $date->format('Y-m-d'))
        );
        return $query->execute();
    }
}