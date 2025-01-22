<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

interface CompositeDataProviderInterface
{
    /**
     * @param int $quoteId
     * @return array
     */
    public function getData(int $quoteId): array;
}
