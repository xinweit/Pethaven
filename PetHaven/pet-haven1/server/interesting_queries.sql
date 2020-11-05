-- Show top 5 ft_caretaker earners
SELECT *
FROM salaries s JOIN ft_caretakers ft ON s.email=ft.email
WHERE date_trunc('month', s.payment_date) = date_trunc('month', (CURRENT_DATE))
ORDER BY payment_amount DESC
LIMIT 5;

-- Show bottom 5 ft_caretaker performance
SELECT *
FROM salaries s LEFT JOIN ft_caretakers ft ON s.email=ft.email
WHERE date_trunc('month', s.payment_date) = date_trunc('month', (CURRENT_DATE))
ORDER BY payment_amount ASC
LIMIT 5;

