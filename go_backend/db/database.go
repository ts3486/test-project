package database

import (
	"fmt"
	"os"

	"strconv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB
var e error

func Connect() {
	host := os.Getenv("DB_HOST")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbName := os.Getenv("DB_NAME")
    portStr := os.Getenv("DB_PORT")
	port, _ := strconv.Atoi(portStr)


	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable", host, user, password, dbName, port)
	DB, e = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if e != nil {
		panic(e)
	}
}

func Close(){
	sqlDB, _ := DB.DB()
	sqlDB.Close()
}