package main

import (
	"context"
	"crypto/sha256"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path"

	"cloud.google.com/go/storage"
	"github.com/google/uuid"
)

const (
	maxShaBytes = 1000
	maxFileSize = 1.074e+9
)

var (
	bucketName string
	bkt        *storage.BucketHandle
)

func init() {
	bucketName = os.Getenv("BUCKET_NAME")
	ctx := context.Background()
	client, err := storage.NewClient(ctx)
	if err != nil {
		panic(fmt.Sprint("Error while creating storage client ", err))
	}

	bkt = client.Bucket(bucketName)
}

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	r.ParseMultipartForm(5e+8)
	f, fh, _ := r.FormFile("file")

	if f == nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	defer f.Close()

	if fh.Size > maxFileSize {
		log.Println("Too large file upload attempted. Size:", fh.Size, "b")
		w.WriteHeader(http.StatusRequestEntityTooLarge)
		return
	}

	filename, err := generateFilename(f, fh.Filename, fh.Size)
	if err != nil {
		log.Println("Error while generating filename", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// while generating the hash the file was already read so we have to seek to the beginning again
	f.Seek(0, io.SeekStart)

	err = upload(f, filename)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Println("uploaded file with name", filename, "to", bucketName)
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "https://"+bucketName+"/"+filename)

}
func main() {
	http.HandleFunc("/", handler)

	log.Println("Running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func upload(f io.Reader, filename string) error {
	obj := bkt.Object(filename)

	ctx := context.Background()

	w := obj.NewWriter(ctx)

	if _, err := io.Copy(w, f); err != nil {
		log.Println("Error while writing to google cloud object", err)
		return err
	}
	if err := w.Close(); err != nil {
		log.Println("Error while writing to google cloud object", err)
		return err
	}

	_, err := obj.Attrs(ctx)
	if err != nil {
		log.Println("Error while getting object attributes", err)
		return err
	}

	return nil
}
func generateFilename(f io.Reader, fileName string, fileSize int64) (string, error) {
	hash, err := computeHash(f, fileSize)
	if err != nil {
		return "", err
	}

	return hash + path.Ext(fileName), nil
}
func computeHash(f io.Reader, fileSize int64) (string, error) {
	h := sha256.New()

	if fileSize < maxShaBytes {
		if _, err := io.Copy(h, f); err != nil {
			return "", err
		}
	} else {
		if _, err := io.CopyN(h, f, maxShaBytes); err != nil {
			return "", err
		}
	}
	u := uuid.New()

	return fmt.Sprintf("%x%s", h.Sum(nil)[0:3], u.String()[0:3]), nil
}
