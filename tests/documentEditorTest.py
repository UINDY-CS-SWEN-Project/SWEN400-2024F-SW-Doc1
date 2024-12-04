from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoAlertPresentException
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time
import random
import string




driver = webdriver.Chrome()

try:
    # Open Google
    driver.get("http://localhost:3000/home")
    time.sleep(2)
    # Click the button that says register
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/form/div[2]/button[3]")
    button.click()
    time.sleep(2)
    # Fill out the form
    email = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/form/div[1]/input")
    random_string = ''.join(random.choices(string.ascii_letters, k=5))
    email.send_keys(random_string + "@test.com")
    password = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/form/div[2]/input")
    password.send_keys("password")
    button = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/form/button")
    button.click()
    time.sleep(2)
    home = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div[1]/h1")
    assert home.text == "Home"
    button = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div[2]/button[4]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div[1]/div/div/div[2]/div/div/div[2]/div[1]/p")
    button.send_keys("Hello World")
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/div[1]/input")
    button.clear()
    time.sleep(2)
    button.send_keys("Document Title")
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/div[2]/button[3]")
    button.click()
    time.sleep(2)
    alert = driver.switch_to.alert
    if alert.text == "Document created successfully!":
        print("Document Editor test passed")
    else:
        print("Document Editor test failed")
    alert.accept()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/div[2]/button[2]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[2]/button[3]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/input")
    button.send_keys("Document Title")
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/button[1]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/h2")
    if button.text == "Document Title":
        print("Document Search test passed")
    else:
        print("Document Editor test failed")
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div/button[2]")
    button.click()
    time.sleep(2)
    alert = driver.switch_to.alert
    if alert.text == "Document deleted successfully!":
        print("Document List Delete test passed")
    else:
        print("Document List Delete test failed")
    alert.accept()
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/button[3]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[2]/button[2]")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/input")
    button.send_keys("Example Template")
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/textarea")
    button.send_keys("Go Hounds")
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[2]/button")
    button.click()
    time.sleep(2)
    alert = driver.switch_to.alert
    time.sleep(3)
    if alert.text == "Template created successfully!":
        print("Template creation test passed")
    else:
        print("Template creation test failed")
    alert.accept()
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/button")
    button.click()
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[2]/button[4]")
    button.click()
    time.sleep(2)
    dropdown_options = driver.find_elements(By.XPATH, "/html/body/div/div/div/div[1]/div[1]/select")
    dropdown_options[0].click()  # Select the first item
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[2]/div/div/div[2]/div[1]/p")
    if button.text == "Go Hounds":
        print("Template test passed")
    else:
        print("Template test failed")


    time.sleep(2)





    

except Exception as e:
    print("Test failed")
    print(e)
    
    

finally:
    # Close the browser
    driver.quit()
