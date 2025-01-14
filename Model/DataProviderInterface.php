<?php

declare(strict_types=1);

namespace Bluefinch\Checkout\Model;

interface DataProviderInterface
{
    /**
     * @param int $quoteId
     * @return array
     */
    public function getData(int $quoteId): array;
}
