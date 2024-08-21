<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Api;

interface GetCheckoutDataInterface
{
    /**
     * Return checkout data
     *
     * @param mixed $cartId
     * @return string
     */
    public function execute(
        $cartId
    ): string;
}
