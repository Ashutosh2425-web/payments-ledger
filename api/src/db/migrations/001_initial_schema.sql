CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(50) NOT NULL DEFAULT 'USER',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_role_check
        CHECK (role IN ('USER', 'ADMIN'))
);
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID REFERENCES users(id),

    account_type VARCHAR(50) NOT NULL,

    normal_side VARCHAR(10) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT accounts_type_check
        CHECK (
            account_type IN (
                'USER_WALLET',
                'SYSTEM_CASH',
                'SYSTEM_FEES'
            )
        ),

    CONSTRAINT accounts_normal_side_check
        CHECK (
            normal_side IN ('DEBIT', 'CREDIT')
        )
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    idempotency_key VARCHAR(255) UNIQUE,

    reverses_transaction_id UUID
        REFERENCES transactions(id),

    status VARCHAR(50) NOT NULL DEFAULT 'POSTED',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT transactions_status_check
        CHECK (
            status IN (
                'POSTED',
                'REVERSED'
            )
        )
);
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    transaction_id UUID NOT NULL
        REFERENCES transactions(id),

    account_id UUID NOT NULL
        REFERENCES accounts(id),

    side VARCHAR(10) NOT NULL,

    amount_minor BIGINT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT ledger_entries_side_check
        CHECK (
            side IN ('DEBIT', 'CREDIT')
        ),

    CONSTRAINT ledger_entries_amount_check
        CHECK (
            amount_minor > 0
        )
);
CREATE TABLE account_balances (
    account_id UUID PRIMARY KEY
        REFERENCES accounts(id),

    balance_minor BIGINT NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT account_balances_amount_check
        CHECK (
            balance_minor >= 0
        )
);