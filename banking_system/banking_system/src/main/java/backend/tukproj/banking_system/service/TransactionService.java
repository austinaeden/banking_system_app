package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.Account;
import backend.tukproj.banking_system.model.Transaction;
import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.repository.AccountRepository;
import backend.tukproj.banking_system.repository.TransactionRepository;
import backend.tukproj.banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Transaction> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUser_IdOrderByTransactionDateDesc(userId);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc();
    }

    @Transactional
    public Transaction processTransfer(Long fromAccountId, String toAccountName, BigDecimal amount, Long userId) {
        Account account = accountRepository.findById(fromAccountId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (account == null || user == null) {
            throw new RuntimeException("Account or User not found");
        }

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Deduct from sender
        account.setBalance(account.getBalance().subtract(amount));
        accountRepository.save(account);

        // Record transaction
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setUser(user);
        transaction.setAmount(amount.negate()); // Withdrawals are negative in your frontend structure
        transaction.setRecipientInfo(toAccountName);
        transaction.setCategory("Transfer");
        
        return transactionRepository.save(transaction);
    }
}
