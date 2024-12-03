from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
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
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/input")
    button.clear()
    time.sleep(2)
    button.send_keys("Document Title")
    time.sleep(2)
    button = driver.find_element(By.XPATH, "/html/body/div/div/div/div[1]/div/button[2]")
    button.click()
    time.sleep(2)
    
except Exception as e:
    print("Document Editor test failed")
    print(e)
    
    

finally:
    # Close the browser
    driver.quit()
