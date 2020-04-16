import { Injectable } from '@nestjs/common';
import { CreateFailedException, CurrencyNotFoundException } from 'exceptions';
import { CurrencyService } from 'modules/currency/services';
import { UserConfigEntity } from 'modules/user/entities';
import { UserConfigRepository } from 'modules/user/repositories';
import { UpdateResult } from 'typeorm';

@Injectable()
export class UserConfigService {
    constructor(
        private readonly _userConfigRepository: UserConfigRepository,
        private readonly _currencyService: CurrencyService,
    ) {}

    public async createUserConfig(createdUser): Promise<UserConfigEntity[]> {
        const { currencyName } = createdUser;
        const currency = await this._currencyService.findCurrencyByName(
            currencyName,
        );

        if (!currency) {
            throw new CurrencyNotFoundException();
        }

        const config = this._userConfigRepository.create({
            ...createdUser,
            currency,
        });

        try {
            return this._userConfigRepository.save(config);
        } catch (error) {
            throw new CreateFailedException(error);
        }
    }

    public async updateLastPresentLoggedDate(
        userConfig: UserConfigEntity,
    ): Promise<UpdateResult> {
        return this._userConfigRepository.update(userConfig.id, {
            lastPresentLoggedDate: new Date(),
        });
    }
}