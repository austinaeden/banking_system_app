package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.Account;
import backend.tukproj.banking_system.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUser_Id(userId);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public BigDecimal getTotalLiquidity() {
        return accountRepository.findAll().stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
