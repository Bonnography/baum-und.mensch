<?php

namespace CodebombWebsolutions\CbTemplate\Domain\Model;

use TYPO3\CMS\Extbase\Domain\Model\FileReference;
use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
use TYPO3\CMS\Extbase\Annotation\ORM\Lazy;
use TYPO3\CMS\Extbase\Persistence\Generic\LazyLoadingProxy;
use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

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
 * The model for Concerts
 */
class Concerts extends AbstractEntity
{
    /**
     * title
     *
     * @var string
     */
    protected string $title = '';

    /**
     * description
     *
     * @var string
     */
    protected string $description = '';

    /**
     * date
     *
     * @var string
     */
    protected string $date = '';

    /**
     * location
     *
     * @var string
     */
    protected string $location = '';

    /**
     * price
     *
     * @var string
     */
    protected string $price = '';

    /**
     * ticketLink
     *
     * @var string
     */
    protected string $ticketLink = '';

    /**
     * composer
     *
     * @var string
     */
    protected string $composer = '';

    /**
     * subtitle
     *
     * @var string
     */
    protected string $subtitle = '';

    /**
     * teaser
     *
     * @var string
     */
    protected string $teaser = '';

    /**
     * time
     *
     * @var string
     */
    protected string $time = '';

    /**
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\TYPO3\CMS\Extbase\Domain\Model\Category>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Lazy
     */
    protected $categories;

    /**
     * @phpstan-var \TYPO3\CMS\Extbase\Domain\Model\FileReference|LazyLoadingProxy|null
     * @var \TYPO3\CMS\Extbase\Domain\Model\FileReference|null
     * @Lazy
     */
    protected $concertImage;

    /**
     * Returns the title
     *
     * @return string $title
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Sets the title
     *
     * @param string $title
     * @return void
     */
    public function setTitle($title)
    {
        $this->title = $title;

    }

    /**
     * Returns the description
     *
     * @return string $description
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Sets the description
     *
     * @param string $description
     * @return void
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * Returns the date
     *
     * @return string $date
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Sets the date
     *
     * @param string $date
     * @return void
     */
    public function setDate($date)
    {
        $this->date = $date;
    }

    /**
     * Returns the location
     *
     * @return string $location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Sets the location
     *
     * @param string $location
     * @return void
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * Returns the price
     *
     * @return string $price
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Sets the price
     *
     * @param string $price
     * @return void
     */
    public function setPrice($price)
    {
        $this->price = $price;
    }

    /**
     * Returns the ticketLink
     *
     * @return string $ticketLink
     */
    public function getTicketLink()
    {
        return $this->ticketLink;
    }

    /**
     * Sets the ticketLink
     *
     * @param string $ticketLink
     * @return void
     */
    public function setTicketLink($ticketLink)
    {
        $this->ticketLink = $ticketLink;
    }

    /**
     * Returns the composer
     *
     * @return string $composer
     */
    public function getComposer()
    {
        return $this->composer;
    }

    /**
     * Sets the composer
     *
     * @param string $composer
     * @return void
     */
    public function setComposer($composer)
    {
        $this->composer = $composer;
    }

    /**
     * Returns the subtitle
     *
     * @return string $subtitle
     */
    public function getSubtitle()
    {
        return $this->subtitle;
    }

    /**
     * Sets the subtitle
     *
     * @param string $subtitle
     * @return void
     */
    public function setSubtitle($subtitle)
    {
        $this->subtitle = $subtitle;
    }

    /**
     * Returns the teaser
     *
     * @return string $teaser
     */
    public function getTeaser()
    {
        return $this->teaser;
    }

    /**
     * Sets the teaser
     *
     * @param string $teaser
     * @return void
     */
    public function setTeaser($teaser)
    {
        $this->teaser = $teaser;
    }

    /**
     * Returns the time
     *
     * @return string time
     */
    public function getTime()
    {
        return $this->time;
    }

    /**
     * Sets the time
     *
     * @param string $time
     * @return void
     */
    public function setTime($time)
    {
        $this->time = $time;
    }

    /**
     * Returns the categories
     *
     * @return ObjectStorage
     */
    public function getCategories(): ?ObjectStorage
    {
        return $this->categories;
    }

    /**
     * Sets the categories
     *
     * @param ObjectStorage
     * @return void
     */
    public function setCategories($categories): void
    {
        $this->categories = $categories;
    }

    /**
     * Returns the concertImage
     *
     */
    public function getConcertImage(): ?FileReference
    {
        if ($this->concertImage instanceof LazyLoadingProxy) {
            /** @var FileReference $concertImage */
            $concertImage = $this->concertImage->_loadRealInstance();
            $this->concertImage = $concertImage;
        }

        return $this->concertImage;
    }

    public function setConcertImage(FileReference $concertImage): void
    {
        $this->concertImage = $concertImage;
    }
}