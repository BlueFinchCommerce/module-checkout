<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

interface CompositeDataProviderInterface
{
    /**
     * @param int $quoteId
     * @return array
     */
    public function getData(int $quoteId): array;
}
