<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Api;

interface GetGuestCheckoutDataInterface
{
    /**
     * Checkout Data endpoint for Guests
     *
     * @param string $cartId
     * @return string
     */
    public function execute(
        string $cartId
    ): string;
}
