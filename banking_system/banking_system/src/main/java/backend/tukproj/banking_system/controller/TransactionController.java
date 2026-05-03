package backend.tukproj.banking_system.controller;

import backend.tukproj.banking_system.model.Transaction;
import backend.tukproj.banking_system.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> transferData) {
        try {
            Long fromAccountId = Long.parseLong(transferData.get("fromAccount").toString());
            String toAccountName = transferData.get("toAccount").toString();
            BigDecimal amount = new BigDecimal(transferData.get("amount").toString());
            Long userId = Long.parseLong(transferData.get("userId").toString());

            Transaction result = transactionService.processTransfer(fromAccountId, toAccountName, amount, userId);
            return ResponseEntity.ok(Map.of("success", true, "balance", result.getAccount().getBalance()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
