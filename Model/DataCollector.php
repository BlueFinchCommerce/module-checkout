<?php
declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

class DataCollector
{
    /** @var bool */
    private bool $ratesCollected = false;

    /** @var bool */
    private bool $totalsCollected = false;

    /**
     * Return whether rates have already been collected
     *
     * @return bool
     */
    public function getRatesCollected(): bool
    {
        return $this->ratesCollected;
    }

    /**
     * Set status of rates collection
     *
     * @param bool $setting
     * @return DataCollector
     */
    public function setRatesCollected(bool $setting): DataCollector
    {
        $this->ratesCollected = $setting;
        return $this;
    }

    /**
     * Return whether rates have already been collected
     *
     * @return bool
     */
    public function getTotalsCollected(): bool
    {
        return $this->totalsCollected;
    }

    /**
     * Set status of totals collection
     *
     * @param bool $setting
     * @return DataCollector
     */
    public function setTotalsCollected(bool $setting): DataCollector
    {
        $this->totalsCollected = $setting;
        return $this;
    }
}
