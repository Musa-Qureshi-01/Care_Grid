

    @staticmethod
    def send_bulk_emails(template_id: str, providers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Send bulk emails to multiple providers.
        
        Args:
            template_id: Email template to use
            providers: List of provider dictionaries
            
        Returns:
            Dictionary with email sending results
        """
        from datetime import datetime
        
        sent_count = 0
        failed_count = 0
        confirmations = []
        
        for provider in providers:
            try:
                email = provider.get("email", f"{provider.get('name', 'unknown')}@example.com")
                recipients = [email]
                
                success = EmailService.send_email(template_id, recipients, {"provider": provider})
                
                if success:
                    sent_count += 1
                    confirmations.append({
                        "provider_name": provider.get("name"),
                        "email": email,
                        "status": "sent",
                        "timestamp": datetime.now().isoformat()
                    })
                else:
                    failed_count += 1
                    
            except Exception as e:
                failed_count += 1
                logger.error(f"Failed to send email to {provider.get('name')}: {e}")
        
        return {
            "status": "success",
            "total_providers": len(providers),
            "sent": sent_count,
            "failed": failed_count,
            "confirmations": confirmations
        }
