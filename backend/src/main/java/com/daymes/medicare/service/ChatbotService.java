package com.daymes.medicare.service;

import com.daymes.medicare.model.Medicine;
import com.daymes.medicare.dto.ChatRequest;
import com.daymes.medicare.dto.ChatBotResponse;
import com.daymes.medicare.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service to handle chatbot interactions and determine appropriate responses.
 */
@Service
public class ChatbotService {
    private final MedicineRepository medicineRepository;

    public ChatbotService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // Processes an incoming message and returns a smart HTML reply
    public ChatBotResponse processMessage(ChatRequest req) {
        String msg = req.getMessage().toLowerCase();
        String reply = "";

        // Emergency check
        if (msg.contains("chest pain") || msg.contains("breathing") || msg.contains("severe bleeding") || msg.contains("emergency")) {
            reply = "<div class='text-red-400 font-medium mb-2'>⚠️ URGENT WARNING</div>"
                  + "<p>Please seek immediate emergency medical care. Call 911 or go to the nearest emergency room.</p>";
        }
        // Diagnosis/prescription check
        else if (msg.contains("prescribe") || msg.contains("diagnose")) {
            reply = "<p>I am an AI assistant and cannot prescribe medication or diagnose conditions. Please consult a qualified healthcare professional.</p>";
        }
        // Common ailments
        else if (msg.contains("headache")) {
            reply = "<p>For a standard headache, ensure you are hydrated and rested. Over-the-counter options like Paracetamol or Ibuprofen might help. If it persists, see a doctor.</p>";
        }
        else if (msg.contains("cough") || msg.contains("sore throat")) {
            reply = "<p>For a cough or sore throat, warm fluids and throat lozenges can help. You might also consider a standard cough syrup after consulting a pharmacist.</p>";
        }
        else if (msg.contains("fever")) {
            reply = "<p>For a mild fever, rest and stay hydrated. Medications like Acetaminophen can help reduce fever. Seek medical help if it remains high.</p>";
        }
        else if (msg.contains("acidity") || msg.contains("digestion") || msg.contains("stomach")) {
            reply = "<p>For mild acidity or digestion issues, antacids can provide quick relief. Eat smaller meals and avoid spicy foods.</p>";
        }
        // Reorder/Refill
        else if (msg.contains("refill") || msg.contains("reorder") || msg.contains("regular medicine")) {
            reply = "<p>You can easily manage your refills in the <strong>My Cabinet</strong> section. Simply select the items and click 'Reorder Selected'.</p>";
        }
        // Doctor consultation
        else if (msg.contains("doctor") || msg.contains("consultation")) {
            reply = "<p>We offer online doctor consultations. You can book an appointment through our tele-health portal in the app.</p>";
        }
        // Order tracking
        else if (msg.contains("order") || msg.contains("track") || msg.contains("delivery")) {
            reply = "<p>To track an order, go to the <strong>Orders</strong> page in your dashboard where you can see real-time updates.</p>";
        }
        // Search medicine repository
        else {
            List<Medicine> meds = medicineRepository.findAll();
            boolean foundMed = false;
            for (Medicine med : meds) {
                if (med.getName() != null && msg.contains(med.getName().toLowerCase())) {
                    reply = "<p><strong>" + med.getName() + "</strong>: " + med.getPurpose() + "</p>"
                          + "<p>Dosage: " + med.getDosage() + "</p>"
                          + "<p>Price: $" + String.format("%.2f", med.getPrice()) + "</p>";
                    foundMed = true;
                    break;
                }
            }
            if (!foundMed) {
                reply = "<p>I'm here to help with your medical and pharmacy needs. You can ask me about medicines, order tracking, or health advice.</p>";
            }
        }

        ChatBotResponse response = new ChatBotResponse();
        response.setReply(reply);
        return response;
    }
}
