<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

interface DataProviderInterface
{
    /**
     * Return an array of data
     *
     * @param int $quoteId
     * @return array
     */
    public function getData(int $quoteId): array;
}
