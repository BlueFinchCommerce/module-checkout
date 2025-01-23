<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Api;

interface GetCheckoutDataInterface
{
    /**
     * @param mixed $cartId
     * @return string
     */
    public function execute(
        $cartId
    ): string;
}
