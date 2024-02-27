<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Api;

interface GetCustomerAddressesInterface
{
    /**
     * @return string
     */
    public function execute(): string;
}
