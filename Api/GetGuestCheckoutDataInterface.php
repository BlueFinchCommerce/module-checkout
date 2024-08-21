<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Api;

interface GetGuestCheckoutDataInterface
{
    /**
     * Return checkout data for Guest users
     *
     * @param string $cartId
     * @return string
     */
    public function execute(
        string $cartId
    ): string;
}
